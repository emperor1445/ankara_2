import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { BannerAd, BannerAdSize} from 'react-native-google-mobile-ads'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5333424817197074/5264778937'; // Replace 'your-ad-unit-id' with the actual ID in production

interface ImageData {
  id: number;
  originalName: string;
  fileName: string;
  url: string;
  uploadTime: string;
}

export default function DetailPage() {
  const { title, tag } = useLocalSearchParams(); // Retrieving 'tag' passed from the previous page
  const navigation = useNavigation();
  const router = useRouter();
  const [adLoaded, setAdLoaded] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Error state

  // Create the interstitial ad here to ensure it's scoped to this page
  const interstitial = InterstitialAd.createForAdRequest(adUnitId);

  // Set up the navigation header with back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title || 'Bookmarked Styles',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (interstitial.loaded) {
              interstitial.show();
            } else {
              navigation.goBack();
            }
          }}
          style={{ paddingHorizontal: 10 }}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, interstitial]);

  // Fetch images when the 'tag' parameter changes
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Set loading state to true while fetching images
      try {
        const response = await fetch(`https://codmprosperyeye.com.ng/images/${tag}`);

        const data = await response.json();      

        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
          setError(null); // Reset error state on success
        } else {
          setImages([]);
          setError('No images found for this tag.');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [tag]); // Trigger this effect whenever 'tag' changes

  // Handle the back navigation and show the ad scoped to this page
  useEffect(() => {
    const backAction = () => {
      // Show the interstitial ad when back button is pressed
      if (interstitial.loaded) {
        interstitial.show();
      } else {
        navigation.goBack(); // Navigate back if ad is not loaded
      }
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []); // This effect runs once when the component is mounted

  // Load and show the ad only when this page is visited
  useEffect(() => {
    const onAdEvent = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      // Navigate back when the ad is dismissed, if needed
      navigation.goBack(); // You can customize what happens after the ad is closed
    });

    interstitial.load(); // Load the ad when the page is mounted

    return () => {
      // Cleanup the ad listener when the component is unmounted
      onAdEvent();
    };
  }, []); // This effect runs only once to load the ad

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>

              {/* Banner Ad */}
      <BannerAd
        unitId="ca-app-pub-5333424817197074/3170751028" // Official test ID
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />

      {images.length > 0 ? (
        images.map((item) => (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/download',
                  params: { 
                    index: item.id.toString(),
                    title: title || 'Image',
                    style: 'Style description', // You can customize this style
                    imageUrl: item.url, // Passing the image URL from API
                    originalName: item.originalName, // Passing the image name from API
                  },
                })
              }
            >
              <Image
                source={{ uri: item.url }} // Use the image URL from the API response
                style={styles.image}
                resizeMode="stretch"
              />
            </TouchableOpacity>
            
            <View style={styles.textContainer}>
              <Text style={styles.imageTitle}>{title}</Text>
              <Text style={styles.imageStyle}>See more...</Text>
            </View>
            <TouchableOpacity style={styles.iconContainer}>
              <FontAwesome name="heart" size={24} color="tomato" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noImagesText}>No images available under this tag.</Text> // Show this if no images are found
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 15,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'stretch', // Ensure the image fits within the space
  },
  textContainer: {
    padding: 10,
    width: '100%',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  imageStyle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  noImagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 20,
  },
});
