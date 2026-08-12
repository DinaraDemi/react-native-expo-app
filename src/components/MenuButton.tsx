import { COLORS } from "@/constants/colors";
import { DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";

export const MenuButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 16 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="menu" size={24} color={COLORS.text} />
    </TouchableOpacity>
  );
};
