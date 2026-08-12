import { CartButton } from "@/components/CartButton";
import { MenuButton } from "@/components/MenuButton";
import { COLORS } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Drawer
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.text,
            headerTitleStyle: { fontWeight: "bold" },
            headerRight: () => <CartButton />,
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
