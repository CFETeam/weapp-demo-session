const co = require('co');
const PaintsBase = require('../base');
const mongo = require('../../../libs/mongo');

class DeletePaints extends PaintsBase {
    handle() {
        const openId = this.openId;
        const id = String(this.req.body.id || '');

        if (!openId) {
            return this.fail({ 'reason': 'openId does not exists' });
        }

        if (!id) {
            return this.fail({ 'reason': 'id does not exists' });
        }

        co.wrap(function *() {
            let db;

            try {
                db = yield mongo.connect();

                let paints = db.collection('paints');
                yield paints.findOneAndDelete({ openId, id });

                this.success();

            } catch (err) {
                this.fail({ 'reason': err.message });
            } finally {
                db && db.close();
            }

        }).call(this);
    }
}

module.exports = DeletePaints.makeRouteHandler();