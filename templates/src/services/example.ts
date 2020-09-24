import {SNRequest} from 'statenext-api'

export default {
    get: async (req: SNRequest) => {
        return {
            msg: "hello world from statenext"
        };
    }
}