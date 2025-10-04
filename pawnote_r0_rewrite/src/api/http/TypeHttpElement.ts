import { deserialize } from "~d0/deserialize";
import { TypeHttpVariable } from "./TypeHttpVariable";

interface Element<T> {
	_T: TypeHttpVariable.TypeHttpElement;
	V: Array<T>;
}

export class TypeHttpElement<T extends new (...args: any[]) => any> {
	public constructor(private readonly Model: T) {}

	public deserializer = (value: Element<InstanceType<T>>): Array<InstanceType<T>> => {
		if (value._T !== TypeHttpVariable.TypeHttpElement) throw new Error("HTTP type is not compatible");

		return value.V.map((inner) => deserialize(this.Model, inner));
	};
}
