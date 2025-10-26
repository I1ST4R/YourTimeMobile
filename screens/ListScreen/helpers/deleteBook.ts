import { Alert } from "react-native";
import { Book } from "../ListScreen";

export const deleteBook = (
  bookId: string, 
  bookTitle: string,
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>,
  selectedId: string | null,
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  Alert.alert(
    "Удалить книгу",
    `Вы уверены что хотите удалить "${bookTitle}"?`,
    [
      { text: "Отмена", style: "cancel" },
      { 
        text: "Удалить", 
        style: "destructive",
        onPress: () => {
          setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
          if (selectedId === bookId) {
            setSelectedId(null);
          }
        }
      }
    ]
  );
};