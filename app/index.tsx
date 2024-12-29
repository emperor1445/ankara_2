import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Share, Alert, Linking } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BannerAd, BannerAdSize, TestIds, AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';

const appOpenAdUnitId = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-5333424817197074/2051470076'; 

  const App: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
      // Create and load the App Open Ad
      const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
  
      const handleAdLoaded = () => {
        appOpenAd.show();
      };
  
      const handleAdError = (error: any) => {
        console.error('Ad Error:', error);
      };
  
      // Add event listeners
      const loadedListener = appOpenAd.addAdEventListener(AdEventType.LOADED, handleAdLoaded);
      const errorListener = appOpenAd.addAdEventListener(AdEventType.ERROR, handleAdError);
  
      // Load the ad
      appOpenAd.load();
  
      // Cleanup listeners on unmount
      return () => {
        loadedListener();
        errorListener();
      };
    }, []);
  
  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  // Share app logic
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app: Latest Ankara Styles! Download it from the Play Store here: https://play.google.com/store/apps/details?id=com.boma.ankara',
      });
    } catch (error) {
      Alert.alert("Error", "There was an issue sharing the app.");
    }
  };

  // Rate Us logic - Open app's Play Store page
  const handleRateUs = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.boma.ankara').catch(() =>
      Alert.alert("Error", "Could not open the Play Store. Please check your internet connection.")
    );
  };

  // Contact Us logic - Open email client
  const handleContactUs = () => {
    const email = 'davidemperor1445@gmail.com';
    const subject = 'Feedback for Ankara Styles';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(mailtoUrl).catch(() =>
      Alert.alert("Error", "Could not open email client.")
    );
  };

  const bannerError = (error: any) => {
    console.error("Banner ad error: ", error);
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Ankara Styles</Text>
        <Link href="./bookmark">
          <Icon name="bookmark" size={30} color="blue" />
        </Link>
      </View>

            {/* Banner Ad */}
      <BannerAd
        unitId="ca-app-pub-5333424817197074/3170751028" // Official test ID
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />

      {/* Modal for menu actions */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Icon name="clear" size={24} color="gray" />
            </TouchableOpacity>

            {/* Menu Options */}
            <TouchableOpacity style={styles.modalOption} onPress={handleShare}>
              <Text style={styles.modalOptionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleRateUs}>
              <Text style={styles.modalOptionText}>Rate Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleContactUs}>
              <Text style={styles.modalOptionText}>Contact Us/Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={toggleModal}>
              <Link href="./bookmark">
                <Text style={styles.modalOptionText}>Bookmark</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* New Styles Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>New Styles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Wedding',
                  tag: 'a1',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.largeCard}>
                <Image source={require('../assets/images/a1.jpg')} style={styles.image} />
                <TouchableOpacity style={styles.heartIcon}>
                  <Icon name="favorite" size={24} color="red" />
                </TouchableOpacity>
                <Text style={styles.cardText}>Wedding</Text>
                <Text style={styles.cardSubText}>30 styles</Text>
              </TouchableOpacity>
            </Link>

            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Trending',
                  tag: 'a2',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.largeCard}>
                <Image source={require('../assets/images/a2.jpg')} style={styles.image} />
                <TouchableOpacity style={styles.heartIcon}>
                  <Icon name="favorite" size={24} color="red" />
                </TouchableOpacity>
                <Text style={styles.cardText}>Trending</Text>
                <Text style={styles.cardSubText}>30 styles</Text>
              </TouchableOpacity>
            </Link>

            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Elegance',
                  tag: 'a3',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.largeCard}>
                <Image source={require('../assets/images/a3.jpg')} style={styles.image} />
                <TouchableOpacity style={styles.heartIcon}>
                  <Icon name="favorite" size={24} color="red" />
                </TouchableOpacity>
                <Text style={styles.cardText}>Elegance</Text>
                <Text style={styles.cardSubText}>30 styles</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </View>

        {/* Collection Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Collection</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Fashion',
                  tag: 'a4',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.smallCard}>
                <Image source={require('../assets/images/a4.jpg')} style={styles.image} />
                <Text style={styles.cardText}>Fashion</Text>
              </TouchableOpacity>
            </Link>

            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Best Styles',
                  tag: 'a5',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.smallCard}>
                <Image source={require('../assets/images/a5.jpg')} style={styles.image} />
                <Text style={styles.cardText}>Best Styles</Text>
              </TouchableOpacity>
            </Link>

            <Link
              href={{
                pathname: '/detail',
                params: {
                  title: 'Top Fashions',
                  tag: 'a6',
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.smallCard}>
                <Image source={require('../assets/images/a6.jpg')} style={styles.image} />
                <Text style={styles.cardText}>Top Fashions</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </View>

        {/* More Styles Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>More Styles</Text>
          <View style={styles.gridContainer}>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a7',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a7.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a8',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a8.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a9',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a9.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a10',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a10.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a11',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a11.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>

            <Link
            href={{
              pathname: '/detail',
              params: {
                tag: 'a12',
              },
            }}
            asChild>
            <TouchableOpacity style={styles.gridItem}>
              <Image source={require('../assets/images/a12.jpg')} style={styles.gridImage} />
            </TouchableOpacity>
            </Link>
          </View>
        </View>

 
      </ScrollView>

 
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  containerAd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  largeCard: {
    marginRight: 20,
    width: 160,
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '85%',
    borderRadius: 10,
  },
  cardText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubText: {
    fontSize: 12,
    color: 'gray',
  },
  heartIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  smallCard: {
    marginRight: 10,
    width: 120,
    height: 180,
  },
  /* New Styles for More Styles Section */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    marginBottom: 15,
  },
  gridImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
    bannerAdContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Optional margin to separate it from content below
    backgroundColor: '#f0f0f0', // Temporary background color for visibility
    paddingVertical: 10,
  },
  adPlaceholder: {
    fontSize: 14,
    color: 'gray',
  },
});

export default App;
