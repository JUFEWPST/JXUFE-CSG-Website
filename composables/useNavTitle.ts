export const useNavTitle = () => {
  const navTitleBox = useState("navTitleBox", () => ({
    title: "",
    subtitle: "",
    showOnScroll: false,
  }));

  const setTitle = (title: string, subtitle: string = "") => {
    navTitleBox.value.title = title;
    navTitleBox.value.subtitle = subtitle;
  };

  const setScrollReveal = (enable: boolean) => {
    navTitleBox.value.showOnScroll = enable;
  };

  const reset = () => {
    navTitleBox.value.title = "";
    navTitleBox.value.subtitle = "";
    navTitleBox.value.showOnScroll = false;
  };

  return {
    navTitleBox,
    setTitle,
    setScrollReveal,
    reset,
  };
};
