import React, {useState} from 'react'
import { StyleSheet, Text, View, Image, TextInput, Alert } from 'react-native';
import { useSupabase } from '@/app/contexts/SupabaseContext';

interface LinkPopupProps {
  onClose?: () => void;
  onSuccess?: (recipe: any) => void;
}

const LinkPopup = ({ onClose, onSuccess }: LinkPopupProps) => {

    const[link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

      const handleImport = async () => {
    if (!link.trim()) {
      setError('Please enter a link');
      return;
    }

    setLoading(true);
    setError('');
    const supabase = useSupabase();

    try {
      // Get session
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError || !session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Import recipe
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recipe/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          content: link.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error('Failed to import recipe');
      }

      const data = await response.json();
      console.log('Recipe imported:', data);
      
      // Show success message
      Alert.alert('Success', 'Recipe imported successfully!');
      
      // Clear input
      setLink('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Close popup if callback provided
      if (onClose) {
        onClose();
      }
      
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Recipe Link:</Text>
        <View style={styles.textBox}>
        <TextInput 
        style={styles.text}
        placeholder="Link"
        placeholderTextColor={'#abb08cff'}
        value={link}
        onChangeText={setLink}
        />
        </View>
        
    </View>

  )}

  export default LinkPopup

  const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
    },
    textBox:{
        backgroundColor: '#d7d3d3ff',
        borderColor: '#9BA760',
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 10,
        marginTop: 5,
        width: 200,
    },
    text:{
        fontSize: 20,
        color: '#9BA760',
        fontFamily: 'Nunito_400Regular',
    }

  })
