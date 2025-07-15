import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ProfileService, { ProfileData } from '../../services/ProfileService';

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>(ProfileService.getProfile());
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    ProfileService.subscribe(setProfile);
    return () => ProfileService.unsubscribe();
  }, []);

  const handleSave = () => {
    ProfileService.updateProfile(profile);
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {profile.avatar ? (
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
      ) : null}
      <TextInput
        style={styles.input}
        value={profile.name}
        editable={editing}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={String(profile.age)}
        editable={editing}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, age: Number(text) })}
        placeholder="Age"
      />
      <Picker
        selectedValue={profile.gender}
        enabled={editing}
        style={styles.input}
        onValueChange={(itemValue: string) => setProfile({ ...profile, gender: itemValue as 'male' | 'female' | 'other' })}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>
      <TextInput
        style={styles.input}
        value={String(profile.height)}
        editable={editing}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, height: Number(text) })}
        placeholder="Height (cm)"
      />
      <TextInput
        style={styles.input}
        value={String(profile.weight)}
        editable={editing}
        keyboardType="numeric"
        onChangeText={(text) => setProfile({ ...profile, weight: Number(text) })}
        placeholder="Weight (kg)"
      />
      <View style={styles.buttonRow}>
        {editing ? (
          <Button title="Save" onPress={handleSave} />
        ) : (
          <Button title="Edit" onPress={() => setEditing(true)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  input: {
    width: '80%',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
});

export default ProfileScreen; 