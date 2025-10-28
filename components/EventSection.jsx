import React from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    StyleSheet 
} from 'react-native';

export default function EventSection({ title, data }) {
    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
            </Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.summary} numberOfLines={2} ellipsizeMode="tail">
                {item.summary}
            </Text>
        </View>
    );

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={data.slice(0, 6)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCard}
                ListFooterComponent={() => (
                    <View style={styles.viewMoreContainer}>
                        <Text style={styles.viewMoreText}>View More</Text>
                    </View>
                )}
                contentContainerStyle={styles.scrollContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
        marginBottom: 8,
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    card: {
        width: 220,
        height: 224,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 3,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        height: 28,
    },
    date: {
        fontSize: 13,
        color: 'gray',
    },
    summary: {
        fontSize: 14,
        marginTop: 4,
        height: 36,
    },
    viewMoreContainer: {
        width: 220,
        height: 224,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    viewMoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
});
