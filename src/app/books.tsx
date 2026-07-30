import { BookItem } from "@/components/BookItem";
import { EmptyListComponent } from "@/components/EmptyListComponent";
import { COLORS } from "@/constants/colors";
import { Book } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const Books = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchBooks = async (isPullToRefresh = false) => {
        if (!isPullToRefresh) setIsLoading(true);
        setError("");
        try {
            const response = await fetch("https://openlibrary.org/subjects/detective.json");
            const data = await response.json();
            setBooks(data.works ?? []);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch books");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchBooks(true);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={({ item }) => <BookItem item={item} />}
                keyExtractor={(item) => item.key}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <EmptyListComponent isLoading={isLoading} message={error || "No books found"} />
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