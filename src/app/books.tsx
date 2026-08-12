import { fetchBooks } from "@/api/books";
import { BookItem } from "@/components/BookItem";
import { EmptyListComponent } from "@/components/EmptyListComponent";
import { BookListSkeleton } from "@/components/Skeleton";
import { COLORS } from "@/constants/colors";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { RefreshControl, StyleSheet, View } from "react-native";

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

    if (isLoading) {
        return (
            <View style={styles.container}>
                <BookListSkeleton />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlashList
                data={books}
                renderItem={({ item }) => <BookItem item={item} />}
                keyExtractor={(item) => item.key}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <EmptyListComponent
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