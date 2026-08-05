import { COLORS } from "@/constants/colors";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <FavouritesProvider>
        <Drawer screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: COLORS.background
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: "bold" },
          drawerStyle: {
            backgroundColor: COLORS.background,
          },
          drawerActiveTintColor: COLORS.text,
          drawerInactiveTintColor: COLORS.inactive,
        }}>
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
              drawerItemStyle: { display: 'none' },
              title: "Book Details",
              headerLeft: () => {
                const navigation = useNavigation();
                return (
                  <TouchableOpacity 
                    onPress={() => (navigation as any).toggleDrawer()}
                    style={{ marginLeft: 16 }}
                  >
                    <Ionicons name="menu" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                );
              },
            }}
          />
        </Drawer>
        </FavouritesProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
