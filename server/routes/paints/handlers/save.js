const co = require('co');
const PaintsBase = require('../base');
const mongo = require('../../../libs/mongo');

class SavePaints extends PaintsBase {
    handle() {
        const openId = this.openId;
        const id = String(this.req.body.id || '');
        const actions = String(this.req.body.actions || '');

        if (!openId) {
            return this.fail({ 'reason': 'openId does not exists' });
        }

        if (!id || !actions) {
            return this.fail({ 'reason': 'id or actions does not exists' });
        }

        co.wrap(function *() {
            let db;

            try {
                db = yield mongo.connect();

                let paints = db.collection('paints');
                let doc = { openId, id, actions };
                yield paints.findOneAndUpdate({ id }, doc, { 'upsert': true });

                this.success();

            } catch (err) {
                this.fail({ 'reason': err.message });
            } finally {
                db && db.close();
            }

        }).call(this);
    }
}

module.exports = SavePaints.makeRouteHandler();