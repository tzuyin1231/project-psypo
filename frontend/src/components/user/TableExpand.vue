<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">讚數: </span>
        <span class="expand-value">{{ row.numsOfLike }}</span> </Col
      ><Divider type="vertical" /><Col span="6">
        <span class="expand-key">發布時間: </span>
        <span class="expand-value">{{ row.createTime }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <span class="expand-key"
          >----------------評論內容------------------------------------------------</span
        >
        <br />
        <span
          style="white-space: pre-wrap; font-size: 18px; letter-spacing: 1px"
          class="expand-value"
          >{{ row.commentContent }}</span
        >
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object,
  },
};
</script>
