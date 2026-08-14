import { CartButton } from "@/components/CartButton";
import { MenuButton } from "@/components/MenuButton";
import { SignOutButton } from "@/components/SignOutButton";
import { COLORS } from "@/constants/colors";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View } from "react-native";

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => (
          <View style={styles.headerActions}>
            <SignOutButton />
            <CartButton />
          </View>
        ),
        drawerStyle: {
          backgroundColor: COLORS.background,
        },
        drawerActiveTintColor: COLORS.text,
        drawerInactiveTintColor: COLORS.inactive,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="books"
        options={{
          drawerLabel: "Books List",
          title: "Books",
        }}
      />
      <Drawer.Screen
        name="favourites"
        options={{
          drawerLabel: "My Favourites",
          title: "Favourites",
        }}
      />

      {/* Hide internal routes from drawer */}
      <Drawer.Screen
        name="book/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Book Details",
          headerLeft: () => <MenuButton />,
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
