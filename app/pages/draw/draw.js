const request = require('../../lib/session-request.js');
const config = require('../../config.js');
const uuid = require('../../lib/uuid.js');

const app = getApp();

Page({
    data: {
        colors: ['#666666', '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#8A2BE2'],

        paintColor: '#666666',

        // 是否显示loading
        showLoading: false,

        // loading提示语
        loadingMessage: '',
    },

    onLoad({ paintId }) {
        const selectedPaint = app.globalData.selectedPaint;
        if (selectedPaint) {
            this.paintId = selectedPaint.id;
            this.updateCanvas(selectedPaint.actions);
        } else {
            this.paintId = paintId || uuid();
        }
    },

    chooseColor(event) {
        this.setData({
            paintColor: event.currentTarget.dataset.color
        });
    },

    onTouchStart({ touches }) {
        const { clientX, clientY } = touches[0];
        this.movements = [[clientX, clientY]];
    },

    onTouchMove({ touches }) {
        const { clientX, clientY } = touches[0];
        this.movements.push([clientX, clientY]);

        const [start, ...moves] = this.movements;

        const context = wx.createContext();

        context.save();
        context.moveTo(...start);
        moves.forEach(move => context.lineTo(...move));
        console.log(this.data.paintColor);
        context.setStrokeStyle(this.data.paintColor);
        context.setLineWidth(5);
        context.stroke();
        context.restore();

        this.lastActions = context.getActions();
        this.updateCanvas(this.lastActions);
    },

    onTouchEnd({ touches }) {
        wx.showNavigationBarLoading();

        request({
            url: `https://${config.host}${config.basePath}/paints/save`,
            method: "post",
            data: {
                id: this.paintId,
                actions: JSON.stringify(this.lastActions)
            },

            success(result) {
                console.log(result);
            },

            complete: () => {
                wx.hideNavigationBarLoading();
            },
        });
    },

    updateCanvas(actions) {
        wx.drawCanvas({
            canvasId: 'paper',
            actions
        });
    },
});