FROM nginx:lastest

# 删除默认配置
RUN rm -rf /usr/share/nginx/html/*

# 拷贝前端打包文件
COPY dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]