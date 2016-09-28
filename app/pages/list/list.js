const request = require('../../lib/session-request.js');
const config = require('../../config.js');

const app = getApp();
Page({
    data: {
        contextOpen: false,

        paints: [],

        // 是否显示loading
        showLoading: false,

        // loading提示语
        loadingMessage: '',
    },

    onShow() {
        this.loadPaints();
    },

    loadPaints() {
        this.showLoading('正在加载…');

        request({
            url: `https://${config.host}${config.basePath}/paints/list`,
            method: "GET",
            success: ({ data: { data: paints } }) => {
                if (paints) {
                    paints.forEach(paint => paint.actions = JSON.parse(paint.actions));
                    this.updatePaints(paints);
                }
            },
            complete: () => {
                this.hideLoading();
            }
        });
    },

    updatePaints(paints) {
        this.setData({ paints });

        paints.forEach(paint => {
            const context = wx.createContext();

            context.save();
            context.clearRect(0, 0, 5000, 5000);
            context.scale(0.333, 0.333);

            let actions = context.getActions().concat(paint.actions);
            context.restore();
            actions = actions.concat(context.getActions());

            setTimeout(() => {
                wx.drawCanvas({
                    canvasId: 'paint-' + paint.id,
                    actions
                });
            });
        });
    },

    openPaint(e) {
        const paintId = e.currentTarget.dataset.paintId;
        if (this.data.paints) {
            app.globalData.selectedPaint = this.data.paints.find(x => x.id === paintId);
        }
        if (this.data.contextOpen) return;

        // clear paints
        this.updatePaints([]);

        setTimeout(() => wx.navigateTo({ url: '../draw/draw' }), 100);
    },

    openContext() {
        this.setData({ contextOpen: true });
    },

    onContextChange(event) {
        this.setData({ contextOpen: false });
    },

    onDelete({ currentTarget }) {
        const selected = app.globalData.selectedPaint;
        this.setData({ contextOpen: false });

        request({
            url: `https://${config.host}${config.basePath}/paints/delete`,
            method: "POST",
            data: {
                id: selected.id
            },
            success: () => {
                this.loadPaints();
            }
        });
    },

    // 显示loading提示
    showLoading(loadingMessage) {
        this.setData({ showLoading: true, loadingMessage });
    },

    // 隐藏loading提示
    hideLoading() {
        this.setData({ showLoading: false, loadingMessage: '' });
    },
});