<template>
</template>

<script>
    export default {
        name: "script_create",
        data() {
            var timestamp = Date.parse(new Date());
            return {
                script_name: "new_script_" + timestamp + ".sh",
                script_content: "# new script",
                script_type: "powershell",
                script_job_name: "新建脚本"
            }

        },
        mounted () {
            this.$router.push({
                name: "coder",
                params:{
                    script_name: this.script_name,
                    script_content: this.script_content,
                    script_type: this.script_type,
                    script_job_name: this.script_job_name
                }
            });
        }
    }
</script>