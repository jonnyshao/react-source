// 监听动作
export const TAKE = 'TAKE';
// 派发动作
export const PUT = 'PUT';
// 开启一个子进程
export const FORK = 'FORK';
// 调用一个返回promise函数
export const CALL = 'CALL';

// 函数接收一个最后一个参数为callback，在异步完成后调用callback,第1个参数是错误对象，第2个参数是返回值 commonjs style
export const CPS = 'CPS';

export const ALL = 'ALL';

export const CANCEL = 'CANCEL';
