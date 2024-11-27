// 封装一个函数：用于获取当前的时间，然后进行判断
export const getTime = () =>{
  let message
  // 通过内置的构造函数 Date
  let hours = new Date().getHours()
  if (hours <= 9){
    message = '早上'
  }else if (hours <= 12) {
    message = '上午';
  }else if (hours <= 18) {
    message = '下午'
  }else{
    message = '晚上'
  }
  return message
}