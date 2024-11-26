// 可以在这里约束文件的类型和大小
// 格式要求：png、jpg、jpeg、gif 大小小于 2M
// 判断 rawFile.name 代表的文件名是否以 .png、.jpg、.jpeg 或 .gif 结尾
export const beforeUpload = (file: any) => {
  if (/\.(png|jpg|jpeg|gif)$/.test(file.name) && file.size / 1024 / 1024 < 2) {
    return true;
  } else {
    file.error('只允许上传文件小于2M的 png、jpg、jpeg、gif 文件');
    return false;
  }
};
