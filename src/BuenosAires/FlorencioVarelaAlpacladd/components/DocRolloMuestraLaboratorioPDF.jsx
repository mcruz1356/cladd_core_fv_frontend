import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// import AlpaLogo from '../../assets/Images/alpaLogo.png'
import AlpaLogo from '../assets/Images/2alpaLogo.png'
import barcodeQRUrl from '../assets/Images/QR.png'
import barcode from '../assets/Images/BARCODE.png'
// Importar la fuente
Font.register({
    family: 'Open Sans',
    src: 'https://fonts.gstatic.com/s/opensans/v23/mem5YaGs126MiZpBA-UN8rsOUuhs.ttf',
});

// Estilos

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
        paddingTop: 10,
        // paddingBottom: 0.5,
        // marginTop:2.5,

        fontSize: 8,
        fontFamily: 'Open Sans',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 0.5,

    },
    logo: {
        marginTop: 2,
        width: "28%",
        height: "70%",
        marginLeft: -3,
    },
    logoSmall: {
        width: "20%",
        height: "75%",
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    table: {
        display: 'table',
        width: '99%',
        margin: 2,
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginBottom: "-1%",
        marginTop: "1.5%"
    },
    tableLarge: {
        display: 'table',
        width: '99%',
        height: 60,
        margin: 2,
        // border: 1,
        borderTopColor: '#000',
        marginBottom: "-1%",
        marginTop: "1.5%"
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        height: 25,
        width: '100%',
    },
    tableRowSmall: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        height: 20,
        width: '100%',
    },
    tableColSborder: {
        flexDirection: 'row',
        height: 20,
        width: '100%',
        padding: 0.1,
        paddingTop: 2,
    },
    tableCol: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000',
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
    },

    // tableColSborder: {

    //     padding: 0.1,
    //     paddingTop: 2,
    //     width: '100%',
    // },
    tableColLarge: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000',
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
        height: 280,
    },
    tableCode: {
        display: 'table',
        width: '99%',
        margin: 2,
        marginTop: 3,
        marginBottom: -1,

    },
    tableRowCode: {
        flexDirection: 'row',
        height: 25,
        width: '100%',
    },
    tableColCode: {
        padding: 0.1,
        paddingTop: 2,
        width: '100%',
        flexDirection: 'row',

        justifyContent: 'space-around',


    },
    tableColHeader: {
        // backgroundColor: '#d3e1e3',
        color: '#000',
        fontWeight: 'bold',
        padding: 3,
    },
    tableColFooter: {
        fontWeight: 'bold',
        padding: 3,
    },
    tableColTotal: {
        fontWeight: 'bold',
        padding: 3,
        borderTopWidth: 1,
        borderColor: '#000',
    },

    section: {
        marginVertical: 0.5,
    },
    sectionData: {
        marginVertical: 0.5,
        marginRight: -3,
    },
    tableColHeaderText: {
        textAlign: 'center',
        fontSize: 8,
    },
    tableColText: {
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 100,

    },

    tableColTextIzq: {
        textAlign: 'left',
        fontSize: 9,
        fontWeight: 100,
        paddingLeft: 2,

    },
    Cabecera: {
        padding: 0.25,
        margin: 0.25,
    },
    Cuerpo:
    {
        padding: 0.5,
        marginTop: -1,
    },

    barcode: {
        width: '40%',
        marginLeft: 1,
        marginRight: 1,
        height: 30,
        marginTop: 1,
        marginBottom: 0.5,
    },
    signatureLine:
    {
        borderTopWidth: 1,
        borderStyle: 'dotted',
        borderColor: 'black',
        // marginTop: 5,
        // marginBottom: 10,
    },
    lineBreak: {
        borderBottomWidth: 1,
        borderColor: 'white',
        marginVertical: 10,
    },

    signaturesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },

    signatureCol: {
        flex: 1,
        alignItems: 'center',
    },

    signText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    QR: {
        height: 60,
        width: 60,
        marginLeft: 1,
        marginRight: 1,
        marginTop: 0.5,
        marginBottom: 0.5,

    },
    rutina: {
        fontSize: 16,
    },
    motivo: {
        fontSize: 12,
    },
    tmetros: {
        fontSize: 12,
    },
});

/** Calcula rutina consecutiva con el mismo formato YYMM#### del registro. */
function rutinaConsecutiva(rutinaBase, index) {
    const base = String(rutinaBase ?? '');
    const prefix = base.slice(0, 4);
    const num = parseInt(base.slice(4), 10) || 0;
    return `${prefix}${(num + index).toString().padStart(4, '0')}`;
}

function EtiquetaMuestraPage({
    rutinaActual,
    metrosMuestra,
    dia,
    hora,
    anotaciones,
    metrosTotal,
    Rollo,
    motivo,
    articuloTerminado,
    anidarRutina,
    subLote,
    ordenTrabajo,
    informeResultado,
    tarima,
    QrcodeImageUrl,
}) {
    return (
        <Page size="A6" orientation="landscape" style={styles.page}>
            <View style={styles.Cabecera}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={AlpaLogo} />
                    <View style={styles.sectionData}>
                        <Text style={styles.title}>Florencio Varela</Text>
                        <Text>REGISTRO INGRESOS LABORATORIO - CALIDAD  </Text>
                        <Text>Fecha: {dia}   </Text>
                        <Text>Hora: {hora}   </Text>
                        <Text style={styles.rutina}>Rutina {rutinaActual} </Text>
                        <Text style={styles.motivo}>{motivo} </Text>
                    </View>
                    <View style={styles.QR}>
                        <Image src={QrcodeImageUrl} />
                    </View>
                </View>
            </View>
            <View style={styles.Cuerpo}>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Rollo</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Anidar Rutina</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Sublote </Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Orden Trabajo</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Artículo</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Tarima</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText, styles.tmetros]}>{Rollo}</Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}> {anidarRutina}</Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}> {subLote}</Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}> {ordenTrabajo} </Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText, styles.tmetros]}>{articuloTerminado}</Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText, styles.tmetros]}>{tarima}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Informar Resultado</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Metros Totales [m]</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText]}>Muestra [m]</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}>{informeResultado}</Text>
                        </View>
                        <View style={[styles.tableCol, styles.tableColHeader]}>
                            <Text style={[styles.tableColHeaderText, styles.tmetros]}>{metrosTotal}</Text>
                        </View>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText, styles.tmetros]}>{metrosMuestra}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tableLarge}>
                    <View style={styles.tableRowSmall}>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}>ANOTACIONES</Text>
                        </View>
                    </View>
                    <View style={styles.tableRowSmall}>
                        <View style={[styles.tableCol]}>
                            <Text style={[styles.tableColText]}>{anotaciones}</Text>
                        </View>
                    </View>
                </View>
                <Image
                    style={{ width: 150, height: 25, alignSelf: 'center', marginTop: -10 }}
                    src={`http://192.168.40.95:4202/codigodebarratenido/${rutinaActual}`}
                />
            </View>
        </Page>
    );
}

function DocRolloMuestraLaboratorioPDF(props) {
    const { anotaciones, rutina, metrosTotal, Rollo, motivo, articuloTerminado, anidarRutina,
        subLote, ordenTrabajo, informeResultado, tarima, muestra, QrcodeImageUrl, reImpresion } = props;

    const date = new Date();
    const dia = date.toLocaleDateString();
    const hora = date.toLocaleTimeString();

    const muestrasValidas = (Array.isArray(muestra) ? muestra : [])
        .map((item) => (item == null ? '' : String(item).trim()))
        .filter((item) => item !== '');

    // Reimpresión: una sola etiqueta con la rutina indicada.
    // Alta: una etiqueta completa (con código de barras) por cada muestra válida.
    const paginas = reImpresion
        ? [{ rutinaActual: rutina, metrosMuestra: muestrasValidas[0] ?? muestra?.[0] ?? '' }]
        : muestrasValidas.map((metrosMuestra, index) => ({
            rutinaActual: rutinaConsecutiva(rutina, index),
            metrosMuestra,
        }));

    const pageProps = {
        dia,
        hora,
        anotaciones,
        metrosTotal,
        Rollo,
        motivo,
        articuloTerminado,
        anidarRutina,
        subLote,
        ordenTrabajo,
        informeResultado,
        tarima,
        QrcodeImageUrl,
    };

    return (
        <Document>
            {paginas.map(({ rutinaActual, metrosMuestra }) => (
                <EtiquetaMuestraPage
                    key={rutinaActual}
                    rutinaActual={rutinaActual}
                    metrosMuestra={metrosMuestra}
                    {...pageProps}
                />
            ))}
        </Document>
    );
}

export default DocRolloMuestraLaboratorioPDF