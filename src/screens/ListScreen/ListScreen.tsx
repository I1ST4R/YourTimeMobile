import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableHighlight, View } from 'react-native';
import tw from 'twrnc';

import MartinIden from './images/Martin_Iden.jpg';
import Book1984 from './images/1984.jpg';
import MasterMargarita from './images/master_i_margarita.jpg';
import Prest from './images/prest.jpg';
import HruHru from './images/hru_hru.jpg';
import { deleteBook } from './helpers/deleteBook';

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: any; 
};

const ListScreen = () => {

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [books, setBooks] = useState<Book[]>([  
    { 
      id: '1', 
      title: 'Мартин Иден', 
      author: 'Джек Лондон',
      description: 'Крутая книга про сигму который сам себя сделал', 
      cover: MartinIden 
    },
    { 
      id: '2', 
      title: '1984', 
      author: 'Джордж Оруэлл',
      description: 'Антиутопия про тоталитарное общество', 
      cover: Book1984 
    },
    { 
      id: '3', 
      title: 'Мастер и Маргарита', 
      author: 'Михаил Булгаков',
      description: 'Мистика, сатира и философия в одном флаконе', 
      cover: MasterMargarita 
    },
    { 
      id: '4', 
      title: 'Преступление и наказание', 
      author: 'Федор Достоевский',
      description: 'Про студента который решил проверить теорию', 
      cover: Prest 
    },
    { 
      id: '5', 
      title: 'Скотный двор', 
      author: 'Джордж Оруэлл',
      description: 'Про свиней там всяких хрю хрю', 
      cover: HruHru 
    },
  ]);

  

  const renderListPoint = ({ item }: { item: Book }) => (
    <TouchableHighlight
      onPress={() => setSelectedId(item.id)}
      onLongPress={() => deleteBook(
        item.id, 
        item.title,
        setBooks,
        selectedId,
        setSelectedId
      )}  
      underlayColor="#E5E7EB" 
      delayLongPress={500}  
    >
      <View style={[
        tw`flex-row p-4 border-b border-gray-200`,
        selectedId === item.id && tw`bg-blue-100` 
      ]}>
        <Image 
          source={item.cover}
          style={tw`w-20 h-28 rounded-lg mr-4`}
          resizeMode="cover"
        />
        <View style={tw`flex-1 justify-center`}>
          <Text style={tw`text-lg font-bold text-gray-800`}>
            {item.title}
          </Text>
          <Text style={tw`text-sm text-gray-600 mt-1`}>
            {item.author}
          </Text>
          <Text style={tw`text-sm text-gray-500 mt-2`}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );


  return (
    <View style={tw`flex-1 bg-white`}>
      <FlatList
        data={books}
        renderItem={renderListPoint}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ListScreen;