import { DelegateData } from "./DelegateData";
import { Validator } from "./Validator";

export interface RedelegateData extends DelegateData {
	newValidator: Validator,
}