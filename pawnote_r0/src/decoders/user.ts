import {
	AccountKind,
	Attachment,
	SessionHandle,
	Tab,
	TabLocation,
	UserAuthorizations,
	UserParameters,
	UserResource,
} from "~p0/models";
import { decodeAttachment } from "./attachment";
import { decodeTab } from "./tab";

export const decodeUserAuthorizations = (data: any, tabs: any[]): UserAuthorizations => {
	const canReadDiscussions = data.AvecDiscussion ?? false;
	const canDiscuss = canReadDiscussions && !(data.discussionInterdit ?? false);
	const canDiscussWithStaff = canDiscuss && (data.AvecDiscussionPersonnels ?? false);
	const canDiscussWithParents = canDiscuss && (data.AvecDiscussionParents ?? false);
	const canDiscussWithStudents = canDiscuss && (data.AvecDiscussionEleves ?? false);
	const canDiscussWithTeachers = canDiscuss && (data.AvecDiscussionProfesseurs ?? false);

	const locations: TabLocation[] = [];

	if (tabs.length > 0) {
		const traverse = (obj: any): void => {
			if ("G" in obj) {
				locations.push(obj.G);
			}

			if ("Onglet" in obj) {
				obj.Onglet.forEach(traverse);
			}
		};

		tabs.forEach(traverse);
	}

	return {
		canReadDiscussions,
		canDiscuss,
		canDiscussWithStaff,
		canDiscussWithParents,
		canDiscussWithStudents,
		canDiscussWithTeachers,

		hasAdvancedDiscussionEditor: data.AvecDiscussionAvancee ?? false,
		maxAssignmentFileUploadSize: data.tailleMaxRenduTafEleve,

		tabs: locations,
	};
};

export const decodeUserResource = (resource: any, session: SessionHandle): UserResource => {
	let profilePicture: Attachment | null = null;

	if (resource.avecPhoto) {
		profilePicture = decodeAttachment(
			{
				G: 1,
				N: resource.N,
				L: "photo.jpg",
			},
			session,
		);
	}

	const tabs: Map<TabLocation, Tab> = new Map();

	for (const tab of resource.listeOngletsPourPeriodes?.V ?? []) {
		tabs.set(tab.G, decodeTab(tab, session.instance.periods));
	}

	return {
		id: resource.N,
		kind: resource.G,
		name: resource.L,
		establishmentName: resource.Etablissement.V.L,
		className: resource.classeDEleve?.L,
		profilePicture,
		tabs,
		isDirector: resource.estDirecteur ?? false,
		isDelegate: resource.estDelegue ?? false,
		isMemberCA: resource.estMembreCA ?? false,
	};
};

export const decodeUserParameters = (parameters: any, session: SessionHandle): UserParameters => {
	let resources: Array<any>;

	switch (session.information.accountKind) {
		case AccountKind.STUDENT:
		case AccountKind.TEACHER:
			resources = [parameters.ressource];
			break;
		case AccountKind.PARENT:
			resources = parameters.ressource.listeRessources;
			break;
	}

	return {
		id: parameters.ressource.N,
		kind: parameters.ressource.G,
		name: parameters.ressource.L,
		resources: resources.map((resource) => decodeUserResource(resource, session)),
		authorizations: decodeUserAuthorizations(parameters.autorisations, parameters.listeOnglets),
	};
};
