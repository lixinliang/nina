<script>
import file from './file.vue';
import defaultImage from './img/bg.jpg';

let store = microStorage('nina');

let getImage = ( url ) => new Promise(( resolve ) => {
    let img = new Image;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
});

export default {
    components : {
        file,
    },
    data () {
        return {
            image : '',
            focus : false,
            process : false,
            dragging : false,
        };
    },
    computed : {
        disabled () {
            return !(_.every(this.button, ( item ) => !!item.path));
        },
        button () {
            let { excel, ppt, output } = this.$store.state;
            return [
                {
                    key : 'excel',
                    label : '选择 excel',
                    path : excel,
                },
                {
                    key : 'ppt',
                    label : '选择 ppt',
                    path : ppt,
                },
                {
                    key : 'output',
                    label : '选择输出目录',
                    path : output,
                },
            ];
        },
        commit () {
            return this.$store.commit;
        },
        dispatch () {
            return this.$store.dispatch;
        },
    },
    async created () {
        this.dropFiles();
        this.setImage();
        this.bindKey();
    },
    methods : {
        click ( index ) {
            this.$refs.input[index].$el.click();
        },
        select ( index, path ) {
            let { key } = this.button[index];
            this.commit(key, path);
        },
        remove ( index ) {
            let { key } = this.button[index];
            this.commit(key, '');
            this.$refs.input[index].$el.value = '';
        },
        async submit () {
            this.process = true;
            let { err } =  await this.$ipcRenderer.send('generate-ppt', _.map(this.button, ({ path }) => path));
            this.process = false;
            if (err) {
                this.$error(err);
            } else {
                this.$notify('Success!');
            }
        },
        async open ( path ) {
            let { err } = await this.$ipcRenderer.send('open-folder', path);
            if (err) {
                this.$error(err);
            }
        },
        dragenter ( event ) {
            this.dragging = true;
        },
        dragover ( event ) {
            if (!this.dragging) {
                this.dragging = true;
                this.$ipcRenderer.sendSync('focus');
            }
        },
        dragleave ( event ) {
            if (event.toElement == this.$el) {
                this.dragging = false;
            } else {
                // noop
            }
        },
        drop ( event ) {
            this.dragging = false;
            event.preventDefault();
            let { files } = event.dataTransfer;
            this.dispatch('files', _.map(files, ({ path }) => path));
        },
        dropFiles () {
            this.$ipcRenderer.on('drop-files', ({ err, data }) => {
                if (err) {
                    this.$error(err);
                } else {
                    let { files } = data;
                    this.dispatch('files', files);
                }
            });
        },
        async setImage () {
            let image = store('image');
            if (image) {
                if (await getImage(image)) {
                    this.image = image;
                } else {
                    store('image', '');
                }
            }
            if (!this.image) {
                this.image = defaultImage;
            }
            let { err, data } = await this.$ipcRenderer.send('request-image');
            if (!err) {
                store('image', data);
            }
        },
        bindKey () {
            let sid = 0;
            Mousetrap.bind(['tab', 'shift+tab', 'up', 'down'], ( event ) => {
                this.focus = true;
                clearTimeout(sid);
                sid = setTimeout(() => {
                    this.focus = false;
                }, 2000);
                const { keyCode } = event;
                if (keyCode == 38 || keyCode == 40) {
                    let buttons = Array.from(document.querySelectorAll('button'));
                    let active = document.activeElement;
                    let index = buttons.indexOf(active);
                    let max = buttons.length - 1;
                    if (keyCode == 38) {
                        // up
                        index--;
                        if (index < 0) {
                            index = max;
                        }
                    }
                    if (keyCode == 40) {
                        // down
                        index++;
                        if (index > max) {
                            index = 0;
                        }
                    }
                    buttons[index].focus();
                }
            });
        },
    },
    filters : {
        label ({ key, path, label }) {
            if (path) {
                if (key == 'output') {
                    return path;
                } else {
                    return path.split('/').slice(-1)['0'];
                }
            } else {
                return label;
            }
        },
    },
};
</script>

<template>
    <div class="home"
        :class="{ 'process' : process, 'dragging' : dragging }"
        :contenteditable="dragging ? true : false"
        @dragenter="dragenter"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
    >
        <div class="background" :style="{ 'background-image' : `url(${ image })` }" :class="{ 'active' : image }"></div>
        <div class="container">
            <div class="wrap">
                <div class="button" v-for="(item, $index) in button" :class="[item.key, item.path ? 'active' : '']">
                    <button @click="click($index)" :title="item.path ? item.path : ''" :class="{ 'focus' : focus }"></button>
                    <span class="label">{{ item | label }}</span>
                    <div class="option" v-show="item.path">
                        <div class="icon" @click="remove($index)">
                            <i class="remove"></i>
                        </div>
                        <div class="icon" @click="open(item.path)" :title="item.path">
                            <i class="folder"></i>
                        </div>
                    </div>
                    <file :multiple="item.key == 'output'" @select="select($index, $event)" ref="input"></file>
                </div>
                <button class="submit" :class="{ 'disabled' : disabled, 'focus' : focus }" :tabIndex="disabled ? -1 : 0" @click="submit">生成</button>
            </div>
            <div class="tips" v-show="dragging">
                <input type="text" readonly="readonly" value="(*￣∇￣*) 快到碗里来">
                <i></i>
            </div>
        </div>
        <div class="mask"></div>
    </div>
</template>

<style lang="scss" scoped>
    @import "./variable.scss";
    .home {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        cursor: default;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        &.process {
            cursor: progress;
            * {
                pointer-events: none;
            }
            .mask {
                opacity: 1;
            }
        }
        &.dragging {
            * {
                pointer-events: none;
            }
            .wrap {
                visibility: hidden;
            }
        }
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity .2s;
        background-color: rgba(0, 0, 0, .3);
        opacity: 0;
        pointer-events: none;
    }
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity .4s .1s;
        opacity: 0;
        pointer-events: none;
        &.active {
            opacity: 1;
        }
    }
    .container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 50px;
        width: 220px;
        padding: 10px;
        background-color: transparentize(#fff, .2);
        border-radius: 5px;
        position: relative;
    }
    .wrap {

    }
    .tips {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: 0;
        // h3 {
        //     // font-size: 14px;
        //     text-align: center;
        //     margin-top: 70px;
        //     color: #707070;
        //     span {
        //         padding-left: 10px;
        //     }
        // }
        input {
            font-size: 14px;
            display: block;
            margin-top: 70px;
            padding: 0;
            border: 0;
            background-color: transparent;
            width: 120%;
            margin-left: -10%;
            text-align: center;
        }
        i {
            display: block;
            background-image: url(./img/bowl.png);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            width: 50px;
            height: 50px;
            margin: 0 auto;
            margin-top: 25px;
        }
    }
    .button {
        font-size: 0;
        height: 40px;
        margin-bottom: 15px;
        -webkit-app-region: no-drag;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        button {
            border: 0;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            cursor: pointer;
            &.focus:focus {
                @include button-focus;
            }
        }
        &.active {
            &:hover {
                .label {
                    padding-right: 60px;
                }
                .option {
                    opacity: 1;
                }
            }
        }
    }
    .label {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        pointer-events: none;
        font-size: 16px;
        // text-align: center;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
    }
    .option {
        top: 0;
        right: 0;
        position: absolute;
        height: 100%;
        opacity: 0;
        transition: opacity .4s;
    }
    .icon {
        float: right;
        width: 32px;
        height: 100%;
        cursor: pointer;
        position: relative;
        &:first-child {
            border-radius: 0 8px 8px 0;
        }
        .remove {
            top: 10px;
            left: 5px;
        }
        &:hover {
            background-color: rgba(0, 0, 0, .3);
        }
        &:active {
            background-color: rgba(0, 0, 0, .5);
        }
    }
    .ppt {
        button {
            background-color: $color-ppt-normal;
            &:hover {
                background-color: $color-ppt-hover;
            }
            &:active {
                background-color: $color-ppt-press;
            }
        }
    }
    .excel {
        button {
            background-color: $color-excel-normal;
            &:hover {
                background-color: $color-excel-hover;
            }
            &:active {
                background-color: $color-excel-press;
            }
        }
    }
    .output {
        button {
            background-color: $color-output-normal;
            &:hover {
                background-color: $color-output-hover;
            }
            &:active {
                background-color: $color-output-press;
            }
        }
    }
    .submit {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        -webkit-app-region: no-drag;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        text-align: center;
        border: 0;
        width: 100%;
        cursor: pointer;
        color: #fff;
        background-color: $color-submit-normal;
        &:hover {
            background-color: $color-submit-hover;
        }
        &:active {
            background-color: $color-submit-press;
        }
        &.disabled {
            background-color: $color-submit-disabled;
            pointer-events: none;
        }
        &.focus:focus {
            @include button-focus;
        }
    }
    .folder {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        background-image: url(./img/folder.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>


<style lang="scss" scoped>
    i.remove {
      color: #fff;
      position: absolute;
      margin-left: 3px;
      margin-top: 10px;
    }

    i.remove:before {
      content: '';
      position: absolute;
      width: 15px;
      height: 1px;
      background-color: currentColor;
      -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
    }

    i.remove:after {
      content: '';
      position: absolute;
      width: 15px;
      height: 1px;
      background-color: currentColor;
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
    }

    i.heart {
      color: #000;
      position: absolute;
      margin-top: 6px;
      margin-left: 5px;
      width: 9px;
      height: 9px;
      border-left: solid 1px currentColor;
      border-bottom: solid 1px currentColor;
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
    }

    i.heart:before {
      content: '';
      position: absolute;
      top: -5px;
      left: -1px;
      width: 8px;
      height: 5px;
      border-radius: 5px 5px 0 0;
      border-top: solid 1px currentColor;
      border-left: solid 1px currentColor;
      border-right: solid 1px currentColor;
    }

    i.heart:after {
      content: '';
      position: absolute;
      top: 0px;
      left: 8px;
      width: 5px;
      height: 8px;
      border-radius: 0 5px 5px 0;
      border-top: solid 1px currentColor;
      border-right: solid 1px currentColor;
      border-bottom: solid 1px currentColor;
    }

    i.heart-solid {
      color: #000;
      position: absolute;
      margin-top: 6px;
      margin-left: 5px;
      width: 9px;
      height: 9px;
      border-left: solid 1px currentColor;
      border-bottom: solid 1px currentColor;
      background-color: currentColor;
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
    }

    i.heart-solid:before {
      content: '';
      position: absolute;
      top: -5px;
      left: -1px;
      width: 8px;
      height: 5px;
      border-radius: 5px 5px 0 0;
      border-top: solid 1px currentColor;
      border-left: solid 1px currentColor;
      border-right: solid 1px currentColor;
      background-color: currentColor;
    }

    i.heart-solid:after {
      content: '';
      position: absolute;
      top: 0px;
      left: 8px;
      width: 5px;
      height: 8px;
      border-radius: 0 5px 5px 0;
      border-top: solid 1px currentColor;
      border-right: solid 1px currentColor;
      border-bottom: solid 1px currentColor;
      background-color: currentColor;
    }
</style>
