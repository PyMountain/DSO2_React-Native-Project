import * as React from 'react';
import {
  Text, 
  View, 
  StyleSheet, 
  Button, 
  TextInput, 
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from 'react-native';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Busca de órgãos públicos',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchParam: "",
      actualParam: "",
      loading: false,
      res: null
    };
  }

  search() {
    const param = encodeURI(this.state.searchParam);
    var uri = "http://www.transparencia.gov.br/api-de-dados/orgaos-siafi"+
      "?descricao="+param+
      "&pagina=1"
    fetch(uri)
        .then((responseJson) => {
          this.setState({loading: false, param: "", actualParam: param, res: responseJson})
    });

    this.setState({loading: true})
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    var responseList;

    this.state.res ? 
      this.state.res[0] ?
        responseList =  <FlatList
                          data={this.state.res}
                          renderItem={({item}) =>
                            <TouchableOpacity onPress={ () => navigate('Orgao', {orgao: item})}>
                              <View>
                                <Text style={styles.item}>{item.codigoDescricaoFormatado}</Text>
                              </View>
                            </TouchableOpacity>
                          }
                        />
        : responseList = <Text>Nenhum órgão encontrado</Text>
      : responseList = <Text></Text> 

    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>Buscar órgãos públicos</Text>
        <Text>Descrição:</Text>
        <TextInput
          onChangeText={text => this.setState({ searchParam: text })}
        />
        <Button title="Buscar" onPress={() => this.search()} />
        {responseList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
});
