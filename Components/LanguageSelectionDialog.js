import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, RadioButton } from 'react-native-paper';

const LanguageSelectionDialog = ({ visible, onDismiss, onLanguageSelect, selectedLanguage }) => {
  const languages = ['Luganda', 'Runyankole', 'Ateso', 'Lugbara', 'Acholi'];
  const [selected, setSelected] = useState(selectedLanguage);

  const handleLanguageSelect = () => {
    onLanguageSelect(selected);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Select Language</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={value => setSelected(value)} value={selected}>
            {languages.map((language) => (
              <RadioButton.Item
                key={language}
                label={language}
                value={language}
                labelStyle={styles.radioButtonLabel}
              />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleLanguageSelect}>Select</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  radioButtonLabel: {
    fontSize: 16,
  },
});

export default LanguageSelectionDialog;
