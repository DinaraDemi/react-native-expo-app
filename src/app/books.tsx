import { BookItem } from "@/components/BookItem";
import { EmptyListComponent } from "@/components/EmptyListComponent";
import { COLORS } from "@/constants/colors";
import { Book } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const fetchBooks = async (): Promise<Book[]> => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/subjects/detective.json`);
    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }
    const data = await response.json();
    return data.works ?? [];
};

const Books = () => {
    const {
        data: books = [],
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["books"],
        queryFn: fetchBooks,
    });

    const handleRefresh = () => {
        refetch();
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={({ item }) => <BookItem item={item} />}
                keyExtractor={(item) => item.key}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <EmptyListComponent
                        isLoading={isLoading}
                        message={error ? "Failed to fetch books" : "No books found"}
                    />
                }
            />
        </View>
    );
};

export default Books;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.containerBackground,
    },
});