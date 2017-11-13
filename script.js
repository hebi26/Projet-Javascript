$(document).ready(function() {

    var ladate = new Date();
    var year = ladate.getFullYear();
    year = year+1;
    console.log(year);

    //onchange du select on affiche les modele de la marque selectionnée

    $('#marques').on('change', function () {
        selectModel();
    });

    $('#models').on('change', function () {
        calc();
    });


    //on affiche les models dans un deusieme menu deroulant

    function selectModel(){
        var vh_make = $("#marques").val();
        $("#models").html("<option>Models</option>");

        $.getJSON('vehicules.json', function(data) {
            $.each(data,  function (index, x) {         //on parcours le json des vehicules
                if(x.Vehicle_Make === vh_make){         //si la value du select = value json
                    $("#models").append('<option value="'+ x.Vehicle_Model +'">' + x.Vehicle_Description + '</option>');        //on affiche les données qui corespondent
                }
            })
        })
    }

    //function pour les calculs

    function calc(taxOption, totalOption){

        var vh_model = $("#models").val();
        $("#box").html("");

        $.getJSON('vehicules.json', function(data) {
            $.each(data,  function (index, x) {              //on reparcours le json
                if(x.Vehicle_Model === vh_model){           //si le modele du select corespond au modele du json

                    var currentCO2 = x.Vehicle_CO2;         //on definir variable CO2
                    if(currentCO2 === 360){                 //si CO2 > 360 alors taxRate = 50;
                      var taxRate = 50;
                    }

                    $.getJSON('CO2TAX.json', function(data) {       //getjson sur le tableau CO2TAX
                        var arr = [];                               //on initie un tableau vide
                        $.each(data, function (index, x){           //on parcours CO2TAX
                          arr.push(x);                              //on push tout le contenue dans le tableau arr
                        });

                        switch(year) {                                      //en fonction de l'année en cours

                            case 2018:                                               //si 2018
                            for (var i in arr[0]) {                                  //on boucle sur la clef 2018 du tableau
                                if (parseInt(arr[0][i].CO2) === currentCO2) {       //si la valeur du tableau co2 = notre variable co2
                                    taxRate = arr[0][i].TAX;                    //alors on recupere la valeur de la taxe qui correspond
                                    console.log(taxRate);
                                }
                            }
                            break;

                            case 2019:                                              //si 2018
                            for (var i in arr[1]) {                                 //on boucle sur la clef 2019 du tableau
                                if (parseInt(arr[1][i].CO2) === currentCO2) {       //si la valeur du tableau co2 = notre variable co2
                                    taxRate = arr[1][i].TAX;                    //alors on recupere la valeur de la taxe qui correspond
                                    console.log(taxRate)
                                }
                            }
                            break;

                            default:
                                alert('Taxes non calculabes pour cette année');     //default: si on est pas en 2018 ou 2019, message d'erreur.
                                break;
                        }

                        //on affiche les informations du vehicule choisi

                        $('#box').html('<p>PRICE : '+ x.Vehicle_Price_including_VAT +'</p>'+
                            '<p>CO2: '+ currentCO2+'</p>'+
                            '<p>TAXRATE: '+ taxRate +'</p>'+
                                //on genere des input pour les options
                                '<button class="scrollOption">options</button>'+
                                '<div class="boxoption">'+
                                '<input id="option1" type="text" placeholder="prix option..." value="0"><br>'+
                                '<input id="option2" type="text" placeholder="prix option..." value="0"><br>'+
                                '<input id="option3" type="text" placeholder="prix option..." value="0"><br>'+
                                '<input id="option4" type="text" placeholder="prix option..." value="0"><br>'+
                                '<input id="option5" type="text" placeholder="prix option..." value="0"><br>'+
                                '</div>');
                        $('.boxoption').hide();
                        $('.scrollOption').click(function(){
                            $('.boxoption').toggle(300);
                        });
                        //si on change la valuer des options
                            $("#option1, #option2, #option3, #option4, #option5").on('change', function(){
                                var priceOption1 = $("#option1").val();
                                priceOption1=parseInt(priceOption1);

                                var priceOption2 = $("#option2").val();
                                priceOption2 = parseInt(priceOption2);

                                var priceOption3 = $("#option3").val();
                                priceOption3 = parseInt(priceOption3);

                                var priceOption4 = $("#option4").val();
                                priceOption4 = parseInt(priceOption4);

                                var priceOption5 = $("#option5").val();
                                priceOption5 = parseInt(priceOption5);

                                var totalPriceOption = priceOption1 + priceOption2 + priceOption3 + priceOption4 + priceOption5;    //calcul prix total option
                                console.log(totalPriceOption);
                                var totalTaxOption = ((totalPriceOption * 0.945) * (taxRate * 0.01)) / (1 - (taxRate * 0.01));
                                var totalOption = totalTaxOption + totalPriceOption;

                                calcul(totalTaxOption, totalOption); //on rappele la fonction de calcul general
                            });

                            //function de calcul general
                            function calcul(totalTaxOption, totalOption) {               //on passe en paramettre les resultats du calcul de l'opion

                                if (totalTaxOption === undefined || totalOption === undefined) {       //condition si l'option est pas rempli
                                    totalTaxOption = 0;                                                 //on initilaise valeurs a 0
                                    totalOption = 0;
                                }

                                //calcul taxe prix vehicule
                                var pricetax = (((x.Vehicle_Price_including_VAT) * 0.945) - 250) * (taxRate * 0.01) / (1 - (taxRate * 0.01));
                                //calcul taxes totales
                                var totaltax = pricetax + totalTaxOption;
                                //calcul prix total vehicuke + taxes(vehicule + option)
                                var totalprice = (x.Vehicle_Price_including_VAT) + pricetax + totalOption;

                                //on affiche les resultas des calcul
                                $('#box2').html('<strong> TOTAL TAX: ' + totaltax + '</strong>' +
                                    '<br>' +
                                    '<strong> TOTAL PRICE WITH TAX: ' + totalprice + '</strong>');
                            }
                            calcul();           //on appele la function pour calculer au on change
                    });




                }
            })
        });
    }
});

