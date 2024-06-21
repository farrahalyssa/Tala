import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Avatar from "./Avatar";
import ProfileStats from "./ProfileStats";
import { UserData } from "./UserData"; // Assuming UserData function is correctly defined
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../../FirebaseConfig';

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const auth = getAuth(); // Correctly initialize auth instance

      try {
        const uid = auth.currentUser?.uid; // Get the authenticated user's UID
        if (uid) {
          const data = await UserData(uid); // Call function to fetch user data
          setUserData(data);
        } else {
          console.error('User not authenticated.');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false); // Always set loading to false when done (success or error)
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D0D0D" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error loading user data.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.containerCenter}>
          <Avatar />
          <Text style={[styles.nameText, styles.boldText]}>{userData.name}</Text>
          <Text style={styles.normalText}>{userData.username}</Text>
          <Text style={styles.bioText}>{userData.bio}</Text>
          <ProfileStats />
        </View>
        <View style={styles.divider} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    justifyContent: 'space-between',
  },
  containerCenter: {
    alignItems: 'center',
    padding: 20,
  },
  nameText: {
    fontSize: 24,
  },
  boldText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginVertical: 20,
  },  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default ProfileScreen;