<script>
export default {
    props : {
        options : Array,
        choice : {
            type : Number,
            default : 0,
        },
    },
    computed : {
        slider () {
            let width = `${ this.width }%`;
            let transform = `translate3d(${ 100 * this.active }%, 0, 0)`;
            return {
                width,
                transform,
            };
        },
    },
    data () {
        return {
            width : '0',
            active : 0,
        };
    },
    created () {
        this.active = this.choice;
        this.width = 100 / this.options.length;
    },
    methods : {
        click ( index ) {
            if (this.active != index) {
                this.active = index;
                this.$emit('click', index);
            }
        },
    },
    watch : {
        choice (v) {
            this.active = v;
        },
    },
};
</script>

<template>
    <div class="switch-bar">
        <span class="slider" :style="slider"><i></i></span>
        <div class="option"
            @click="click(index)"
            v-for="(option, index) in options"
            :class="{ 'is-active' : active === index, 'has-unread' : option.unread }"
            :style="{ 'width' : `${ width }%` }"
        ><span>{{ option.name }}<i></i></span></div>
    </div>
</template>

<style lang="scss" scoped>
    .switch-bar {
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid #e6e9ee;
    }
    .option {
        float: left;
        width: 50%;
        height: 100%;
        font-size: 30px;
        color: #434a54;
        text-align: center;
        padding: 0 20px;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
        text-overflow: ellipsis;
        &.is-active {
            color: #49b4ff;
        }
        span {
            position: relative;
            i {
                display: inline-block;
                width: 0;
                height: 0;
                vertical-align: text-top;
                position: relative;
                visibility: hidden;
                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 16px;
                    height: 16px;
                    background-color: #ff3c58;
                    border-radius: 50%;
                    transform: translate3d(3px, -6px, 0);
                }
            }
        }
        &.has-unread {
            span {
                i {
                    visibility: visible;
                }
            }
        }
    }
    .slider {
        position: absolute;
        height: 4px;
        left: 0;
        bottom: 0;
        transition: transform .2s;
        i {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-image: url(./img/slider.png);
        }
    }
</style>
