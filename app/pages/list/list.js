const request = require('../../lib/session-request.js');
const config = require('../../config.js');

const app = getApp();

Page({
    data: {
        contextOpen: false,

        paintIdInContext: '',

        paints: [],

        showLoading: false,

        loadingMessage: '',
    },

    onShow() {
        this.loadPaints();
    },

    loadPaints() {
        this.showLoading('正在加载…');

        request({
            url: `https://${config.host}${config.basePath}/paints/list`,
            method: 'GET',

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

        const context = wx.createContext();

        paints.forEach((paint, index) => {
            context.save();
            context.clearRect(0, 0, 5000, 5000);
            context.scale(0.333, 0.333);

            let actions = [...context.getActions(), ...paint.actions];

            context.restore();
            actions.push(...context.getActions());

            setTimeout(() => {
                wx.drawCanvas({ canvasId: 'paint-' + paint.id, actions });
            }, (index + 1) * 150);
        });
    },

    openPaint(event) {
        if (this.data.contextOpen) {
            return;
        }

        const paints = this.data.paints;
        const paintId = event.currentTarget.dataset.paintId;

        if (paintId) {
            app.globalData.selectedPaint = paints.find(paint => paint.id === paintId);
            console.log('edit paint => ', app.globalData.selectedPaint);
        } else {
            app.globalData.selectedPaint = void(0);
            console.log('create new paint...');
        }

        wx.navigateTo({ url: '../draw/draw' })
    },

    openContext(event) {
        const paintIdInContext = event.currentTarget.dataset.paintId;
        this.setData({ contextOpen: true, paintIdInContext });
    },

    onContextChange() {
        this.setData({ contextOpen: false, paintIdInContext: '' });
    },

    onDelete() {
        const id = this.data.paintIdInContext;
        console.log('deleting paint id =>', id);

        this.setData({ contextOpen: false });
        this.showLoading('正在删除中…');

        request({
            url: `https://${config.host}${config.basePath}/paints/delete`,
            method: 'POST',
            data: { id },

            success: () => {
                let paints = this.data.paints;

                let index = paints.findIndex(paint => paint.id === id);
                console.log('delete index =>', index);

                if (~index) {
                    paints.splice(index, 1);
                    this.updatePaints(paints);
                }
            },

            complete: () => {
                this.hideLoading();
            },
        });
    },

    showLoading(loadingMessage) {
        this.setData({ showLoading: true, loadingMessage });
    },

    hideLoading() {
        this.setData({ showLoading: false, loadingMessage: '' });
    },
});