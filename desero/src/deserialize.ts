import { getModelMetadata } from "./metadata";
import { SchemaType } from "./schema/type";

export function deserialize<T extends new (...args: any[]) => any>(Model: T, data: any): InstanceType<T> {
	const model = new Model();
	const metadata = getModelMetadata(Model);

	for (const [field, schema] of Object.entries(model)) {
		if (!(schema instanceof SchemaType)) continue;

		const info = metadata.find((local) => local.key === field);
		let value = data[field];

		if (info?.rename) {
			value = data[info.rename];
		}

		if (value === null || value === undefined) {
			if (!schema.optional) {
				throw new Error(`required field "${field}" is undefined in provided data`);
			}

			value = null;
		}

		if (value !== null) {
			if (info?.deserializer) {
				value = info.deserializer(value, model);
			} else if (schema.array) {
				const processArray = (value: any, schema: SchemaType): any => {
					if (!Array.isArray(value)) {
						throw new Error(`expected array but got "${typeof value}"`);
					}

					return value.map((item) => {
						if ((item === null || item === undefined) && schema.optional) {
							return null;
						}

						if (schema.array) {
							return processArray(item, schema.array);
						} else if (schema.reference) {
							return deserialize(schema.reference, item);
						} else {
							return item;
						}
					});
				};

				value = processArray(value, schema.array);
			} else if (schema.reference) {
				value = deserialize(schema.reference, value);
			}
		}

		model[field] = value;
	}

	return model;
}
