import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"; 

iziToast.settings({
  timeout: 4000, 
  resetOnHover: true, 
  position: "topRight",
  transitionIn: "fadeInLeft",
  transitionOut: "fadeOutRight",
  progressBar: true,
});

export const toast = {
  success: (message: string, title: string = "Успіх") => {
    iziToast.success({
      title,
      message,
    });
  },

  error: (message: string, title: string = "Помилка") => {
    iziToast.error({
      title,
      message,
    });
  },

  info: (message: string, title: string = "Інфо") => {
    iziToast.info({
      title,
      message,
    });
  },
  
  warning: (message: string, title: string = "Увага") => {
    iziToast.warning({
      title,
      message,
    });
  }
};