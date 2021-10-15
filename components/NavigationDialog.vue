<template>
  <dialog ref="dialog" class="dialog">
    <div class="header">
      <div class="title">Confirm Navigation</div>
      <span class="close" @click="$emit('close')">X</span>
    </div>

    <div class="content">Are you sure you want to leave this page? You will lose all changes.</div>

    <div class="actions">
      <button @click="$emit('close')">Stay on this Page</button>
      <button @click="$emit('leave-page')">Leave this Page</button>
    </div>
  </dialog>
</template>

<script>
export default {
  name: 'NavigationDialog',
  props: {
    value: Boolean
  },
  watch: {
    value (val) {
      if (val) {
        this.$refs.dialog.show()
      } else {
        this.$refs.dialog.close()
      }
    }
  }
}
</script>

<style scoped>
.header {
  height: 50px;
  box-shadow: inset 0px 4px 9px 5px #eee;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
}

.header > .close {
  font-weight: bold;
  cursor: pointer;
}

.content {
  padding: 20px;
  display: grid;
  place-items: center;
}

.actions {
  padding: 20px;
  display: grid;
  grid-auto-flow: column;
  justify-content: end;
  gap: 10px;
}

.actions button {
  padding: 10px;
}
</style>
