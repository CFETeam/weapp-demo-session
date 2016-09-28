const RouterBase = require('../../common/routerbase');

class PaintsBase extends RouterBase {
    constructor() {
        super(...arguments);
        this.openId = String((this.req.$wxUserInfo || {}).openId || '');
    }

    success(data = {}, msg = 'success') {
        this.res.json({ code: 0, msg, data });
    }

    fail(error = { 'reason': 'something wrong was happened' }, msg = 'fail') {
        this.res.json({ code: -1, msg, error });
    }
}

module.exports = PaintsBase;