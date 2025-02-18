import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4ef555",
        backgroundColor: "#242333",
        width: wp("90%"),
      }}
      contentContainerStyle={{
        paddingHorizontal: wp("10%"),
      }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "bold",
        color: "#fff",
      }}
      text2Style={{
        fontSize: wp("4%"),
        color: "#ccc",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#d92518", backgroundColor: "#242333" }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "bold",
        color: "#fff",
      }}
      text2Style={{
        fontSize: wp("4%"),
        color: "#ccc",
      }}
    />
  ),
};

const CustomToast = () => {
  return <Toast config={toastConfig} />;
};

export default CustomToast;
