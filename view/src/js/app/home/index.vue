<script>
import file from './file.vue';

// TODO: add folder shortcut

export default {
    components : {
        file,
    },
    data () {
        return {
            process : false,
            button : [
                {
                    key : 'excel',
                    label : '选择 excel',
                    path : '',
                },
                {
                    key : 'ppt',
                    label : '选择 pptx',
                    path : '',
                },
                {
                    key : 'output',
                    label : '选择输出目录',
                    path : '',
                },
            ],
        };
    },
    computed : {
        disabled () {
            return !(_.every(this.button, ( item ) => !!item.path));
        },
    },
    methods : {
        click ( index ) {
            this.$refs.input[index].$el.click();
        },
        select ( index, path ) {
            this.button[index].path = path;
        },
        remove ( index ) {
            this.button[index].path = '';
            this.$refs.input[index].$el.value = '';
        },
        async submit () {
            this.process = true;
            let { err } =  await this.$ipcRenderer.send('generate-ppt', _.map(this.button, ({ path }) => path));
            this.process = false;
            if (err) {
                this.$notify(this.$ipcRenderer.sendSync('app-name'), `生成失败 >> ${ err.message }`);
            } else {
                this.$notify(this.$ipcRenderer.sendSync('app-name'), '生成成功!');
            }
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
    <div class="home" :class="{ 'process' : process }">
        <div class="container">
            <div class="button" v-for="(item, $index) in button" :class="item.key">
                <button @click="click($index)"></button>
                <span class="label">{{ item | label }}</span>
                <div class="icon" @click="remove($index)" v-show="item.path">
                    <i class="remove"></i>
                </div>
                <file :multiple="item.key == 'output'" @select="select($index, $event)" ref="input"></file>
            </div>
            <div class="submit" :class="{ 'disabled' : disabled }" @click="submit">生成</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "./variable.scss";
    .home {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        &.process {
            cursor: progress;
            * {
                pointer-events: none;
            }
            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .1);
            }
        }
    }
    .container {
        margin: 0 auto;
        width: 200px;
        margin-top: 50px;
    }
    .button {
        font-size: 0;
        height: 40px;
        margin-bottom: 20px;
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
        padding-left: 20px;
        padding-right: 25px;
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
    .icon {
        top: 0;
        right: 0;
        position: absolute;
        width: 32px;
        height: 100%;
        cursor: pointer;
        i {
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
    }

</style>


<style lang="scss" scoped>
.remove {
  color: #fff;
  position: absolute;
  margin-left: 3px;
  margin-top: 10px;
}

.remove:before {
  content: '';
  position: absolute;
  width: 15px;
  height: 1px;
  background-color: currentColor;
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
}

.remove:after {
  content: '';
  position: absolute;
  width: 15px;
  height: 1px;
  background-color: currentColor;
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
}
</style>
