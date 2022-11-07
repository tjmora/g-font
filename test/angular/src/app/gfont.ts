import GFont from "@tjmora-test/g-font";
import { environment} from "../environments/environment";

const g = new GFont(!environment.production);

export default g;