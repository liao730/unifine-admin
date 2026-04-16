<template>
  <el-config-provider>
    <div class="common-layout">
      <el-container style="height: 100vh;">
        <el-aside width="200px" style="background-color: #545c64;">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            :default-active="route.path"
            router
          >
            <el-menu-item index="/products">
              <span>产品管理</span>
            </el-menu-item>
            <el-menu-item index="/cases">
              <span>案例管理</span>
            </el-menu-item>
            <el-menu-item index="/news">
              <span>新闻管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="border-bottom: 1px solid #ddd; display: flex; align-items: center;">
            <h3>Unifine 后台管理系统</h3>
          </el-header>

          <el-main>
            <el-card header="新增案例">
              <el-form :model="form" label-width="120px" style="max-width: 600px;">
                
                <el-form-item label="案例名称">
                  <el-input v-model="form.name" placeholder="请输入案例名称" />
                </el-form-item>

                <el-form-item label="直接发布">
  <el-switch v-model="form.is_published" :active-value="1" :inactive-value="0" />
</el-form-item>

                <el-form-item label="分类">
                  <el-select v-model="form.category" placeholder="选择分类">
                    <el-option label="null" value="null" />
                  </el-select>
                </el-form-item>

                <el-form-item label="封面图片">
                  <el-upload
                    action="/api/upload/image"
                    :data="{ folder: 'cases/list' }"
                    name="file"
                    list-type="picture-card"
                    :on-success="handleUploadSuccess"
                    :limit="1"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="案例简介">
                  <el-input v-model="form.summary" type="textarea" :rows="3" />
                </el-form-item>

                <el-divider content-position="left">案例详情配置</el-divider>

                <div v-for="(item, index) in form.sections" :key="index" class="section-container">
                  <div class="section-header">
                    <span class="section-number">序号 {{ item.sortOrder }}</span>
                    <el-button type="danger" link :icon="Delete" @click="removeSection(index)">删除</el-button>
                  </div>

                  <el-row :gutter="20">
                    <el-col :span="16">
                      <el-form-item label="标题">
                        <el-input v-model="item.title" placeholder="请输入本段标题" />
                      </el-form-item>
                      <el-form-item label="文字内容">
                        <el-input v-model="item.textContent" type="textarea" :rows="5" placeholder="请输入详细描述文字..." />
                      </el-form-item>
                    </el-col>

                    <el-col :span="8">
                      <el-form-item label="配图">
                        <el-upload
                          action="/api/upload/image"
                          :data="{ folder: 'cases/detail' }"
                          name="file"
                          :show-file-list="false"
                          :on-success="(res) => item.imageUrl = res.data"
                        >
                          <img v-if="item.imageUrl" :src="item.imageUrl" class="detail-preview-img" />
                          <el-button v-else type="primary" plain>点击上传详情图</el-button>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-button 
                    v-if="index === form.sections.length - 1"
                    type="primary" 
                    :icon="Plus" 
                    circle 
                    class="add-section-btn" 
                    @click="addSection" 
                  />
                </div>

                <el-form-item>
                  <el-button type="primary" @click="onSubmit" size="large">提交保存</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
                
              </el-form>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </el-config-provider>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router' // 2. 必须引入 useRoute
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const route = useRoute() // 3. 初始化路由实例，给菜单高亮使用

// 表单数据逻辑
const form = reactive({
  name: '',
  coverImage: '', 
  summary: '',
  category: 'null',
  isPublished : 1,
  sortOrder : 0,
  sections: [
    { title: '', textContent: '', imageUrl: '', sortOrder: 1 }
  ]
})

const addSection = () => {
  const newOrder = form.sections.length + 1;
  form.sections.push({ title: '', textContent: '', imageUrl: '', sortOrder: newOrder });
}

const removeSection = (index) => {
  if (form.sections.length <= 1) {
    ElMessage.warning('至少保留一个详情区块');
    return;
  }
  form.sections.splice(index, 1);
  form.sections.forEach((s, i) => s.sortOrder = i + 1);
}

const handleUploadSuccess = (response) => {
  if (response.code === 200) {
    form.coverImage = response.data 
    ElMessage.success('封面图上传成功！')
  }
}

const resetForm = () => {
  form.name = ''
  form.coverImage = ''
  form.summary = ''
  form.category = 'null'
  form.isPublished = 1
  form.sortOrder = 0
  form.sections = [{ title: '', textContent: '', imageUrl: '', sortOrder: 1 }]
}

const onSubmit = async () => {
  if (!form.name || !form.coverImage) {
    ElMessage.warning('请填写名称并上传封面图')
    return
  }

  const submitData = { ...form };
  const flattenedContents = [];
  
  form.sections.forEach(sec => {
    if (sec.title || sec.textContent) {
      flattenedContents.push({ title: sec.title, type: 'text', content: sec.textContent, sortOrder: sec.sortOrder });
    }
    if (sec.imageUrl) {
      flattenedContents.push({ title: sec.title, type: 'image', content: sec.imageUrl, sortOrder: sec.sortOrder });
    }
  });

  submitData.contents = flattenedContents;
  delete submitData.sections;

  try {
    const res = await axios.post('/api/cases/add', submitData);
    if (res.data.code === 200) {
      ElMessage.success('案例保存成功！');
    }
  } catch (error) {
    ElMessage.error('请求失败');
  }
}
</script>

<style scoped>
/* 这里放你之前的 CSS 样式 */
.section-container {
  border: 1px solid #e4e7ed;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
}
.section-header { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f0f2f5; padding-bottom: 10px; }
.section-number { font-weight: bold; color: #409eff; }
.add-section-btn { position: absolute; right: -20px; bottom: -20px; width: 40px; height: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10; }
.detail-preview-img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
</style>