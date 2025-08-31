import { Homepage, HomepageLink, Partner, PartnerARD, PartnerARDWallet } from "~p0/models/homepage";

export const decodePartner = (partner: any): Partner => ({ sso: partner.SSO });

export const decodePartnerARDWallet = (wallet: any): PartnerARDWallet => ({
	name: wallet.libellePorteMonnaie,
	description: wallet.hintPorteMonnaie,
	warning: wallet.avecWarning,
	balance: parseInt(wallet.valeurSolde.replace(",", ".")),
	balanceDescription: wallet.hintSolde,
});

export const decodePartnerARD = (partner: any): PartnerARD => {
	return {
		...decodePartner(partner),
		canRefreshData: partner.avecActualisation,
		wallets: partner.porteMonnaie.V.map(decodePartnerARDWallet),
	};
};

export const decodeHomepageLink = (link: any): HomepageLink => {
	return {
		description: link.commentaire,
		name: link.L,
		url: link.url,
	};
};

export const decodeHomepage = (page: any): Homepage => {
	const links = [];

	let partnerTurboself: Partner | undefined;
	let partnerARD: PartnerARD | undefined;

	if ("partenaireARD" in page) {
		partnerARD = decodePartnerARD(page.partenaireARD);
	}

	for (const link of page.lienUtile.listeLiens.V) {
		if ("SSO" in link) {
			if (link.SSO.codePartenaire === "TURBOSELF") {
				partnerTurboself = decodePartner(link);
			}
		} else {
			links.push(decodeHomepageLink(link));
		}
	}

	return {
		partnerARD,
		partnerTurboself,

		links,
	};
};
