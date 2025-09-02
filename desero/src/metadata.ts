export interface FieldMetadata {
	deserializer?: (value: any, self: InstanceType<any>) => any;
	enum?: any;
	key: string;
	optional?: boolean;
	rename?: string;
}

export function getModelMetadata(clazz: any): Array<FieldMetadata> {
	return clazz.constructor._propertyMetadata || [];
}

export function mutateModelMetadataField(clazz: any, field: string, mutation: (metadata: FieldMetadata) => void): void {
	if (!clazz.constructor._propertyMetadata) {
		clazz.constructor._propertyMetadata = [];
	}

	const metadata = (clazz.constructor._propertyMetadata as any[]).find(
		(local: FieldMetadata) => local.key === field,
	) as FieldMetadata | undefined;

	if (!metadata) {
		const metadata = { key: field };
		mutation(metadata);

		clazz.constructor._propertyMetadata.push(metadata);
	} else {
		mutation(metadata);
	}
}
