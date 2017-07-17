<script>
export default {
    props : ['multiple'],
    methods : {
        select ({ target }) {
            let { files } = target;
            if (files.length) {
                this.$emit('select', files[0].path);
                return;
            }
            this.$emit('select', '');
        },
    },
};
</script>

<template>
    <input type="file"
        :tabIndex="-1"
        @change="select"
        :multiple="multiple"
        :directory="multiple"
        :webkitdirectory="multiple"
    >
</template>

<style lang="scss" scoped>
    input {
        position: absolute;
        top: 100%;
        opacity: 0;
    }
</style>
