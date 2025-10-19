import { Webspace } from "~p0_rw/models";

export interface FonctionParametresRequest {
	identifiantNav: string | null;
	Uuid: string;
}

export interface FonctionIdentifyRequest {
	genreConnexion: number;
	genreEspace: Webspace | ((path: string) => Webspace) | ((webspace: Webspace) => string);
	identifiant: string;
	pourENT: boolean;
	enConnexionAuto: boolean;
	enConnexionAppliMobile: boolean;
	demandeConnexionAuto: boolean;
	demandeConnexionAppliMobile: boolean;
	demandeConnexionAppliMobileJeton: boolean;
	uuidAppliMobile: string;
	loginTokenSAV: string;
}
