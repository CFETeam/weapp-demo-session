module.exports = (router) => {
    // 获取一笔画列表
    router.get('/list', require('./handlers/list'));

    // 保存一笔画
    router.post('/save', require('./handlers/save'));

    // 删除一笔画
    router.post('/delete', require('./handlers/delete'));
};