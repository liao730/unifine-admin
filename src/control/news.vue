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
            <el-menu-item index="/products"><span>产品管理</span></el-menu-item>
            <el-menu-item index="/cases"><span>案例管理</span></el-menu-item>
            <el-menu-item index="/news"><span>新闻管理</span></el-menu-item>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header style="border-bottom: 1px solid #ddd; display: flex; align-items: center;">
            <h3>Unifine 后台管理系统</h3>
          </el-header>

          <el-main>
            <el-card header="发布新资讯">
              <el-form :model="form" label-width="120px" style="max-width: 800px;">
                
                <el-form-item label="新闻标题">
                  <el-input v-model="form.title" placeholder="请输入新闻标题" />
                </el-form-item>

                <el-form-item label="新闻展示时间">
                  <el-date-picker
                    v-model="form.news_time"
                    type="datetime"
                    placeholder="选择发布展示时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>

                <el-form-item label="直接发布">
                  <el-switch v-model="form.is_published" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="封面图片">
                  <el-upload
                    action="/api/upload/image"
                    :data="{ folder: 'news/covers' }"
                    name="file"
                    list-type="picture-card"
                    :on-success="handleUploadSuccess"
                    :limit="1"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="新闻摘要">
                  <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="用于列表页展示的简短描述" />
                </el-form-item>

                <el-form-item label="新闻内容">
                  <el-input 
                    v-model="form.content" 
                    type="textarea" 
                    :rows="15" 
                    placeholder="请输入新闻详情内容 (支持 HTML 格式)" 
                  />
                </el-form-item>

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
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()

const form = reactive({
  title: '',
  coverImage: '', // 改为驼峰
  summary: '',
  content: '',
  newsTime: '',   // 改为驼峰
  isPublished: 1  // 改为驼峰
})

const handleUploadSuccess = (res) => {
  if (res.code === 200) {
    form.cover_image = res.data
    ElMessage.success('新闻封面上传成功')
  }
}

const resetForm = () => {
  Object.assign(form, {
    title: '', cover_image: '', summary: '', content: '', news_time: '', is_published: 1
  })
}

const onSubmit = async () => {
  if (!form.title || !form.content) {
    ElMessage.warning('标题和内容不能为空')
    return
  }
  try {
    const res = await axios.post('/api/news/add', form)
    if (res.data.code === 200) {
      ElMessage.success('新闻发布成功！')
    }
  } catch (error) {
    ElMessage.error('保存失败，请检查后端服务')
  }
}
</script>