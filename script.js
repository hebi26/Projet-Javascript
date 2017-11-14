$(document).ready(function() {

    var ladate = new Date();
    var year = ladate.getFullYear();
    year = year+1;
    console.log(year);

    //liste des functions utilisé au onchange

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

    function calc(){

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

                        $('#box').html(
                            //on genere des input pour les options
                            '<button class="scrollOption">options</button>'+
                            '<div class="boxoption">'+
                            '<input id="option1" type="text" placeholder="prix option..." value="0"><br>'+
                            '<input id="option2" type="text" placeholder="prix option..." value="0"><br>'+
                            '<input id="option3" type="text" placeholder="prix option..." value="0"><br>'+
                            '<input id="option4" type="text" placeholder="prix option..." value="0"><br>'+
                            '<input id="option5" type="text" placeholder="prix option..." value="0"><br>'+
                            '</div>'+

                            '<button class="scrollAcces">accessoires</button>'+
                            '<div class="boxacces">'+
                            '<input id="acces1" type="text" placeholder="prix accessoires..." value="0"><br>'+
                            '<input id="acces2" type="text" placeholder="prix accessoires..." value="0"><br>'+
                            '<input id="acces3" type="text" placeholder="prix accessoires..." value="0"><br>'+
                            '<input id="acces4" type="text" placeholder="prix accessoires..." value="0"><br>'+
                            '<input id="acces5" type="text" placeholder="prix accessoires..." value="0"><br>'+
                            '</div>');

                        $('.boxoption').hide();
                        $('.scrollOption').click(function(){
                            $('.boxoption').toggle(300);
                        });


                        $('.boxacces').hide();
                        $('.scrollAcces').click(function(){
                            $('.boxacces').toggle(300);
                        });

                        //si on change la valuer des options
                        $("#option1, #option2, #option3, #option4, #option5").on('change', function (effectiveTotalAcces){
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
                            var totalTaxOption = ((totalPriceOption * 0.945) * (taxRate * 0.01)) / (1 - (taxRate * 0.01));
                            var totalOption = totalTaxOption + totalPriceOption;

                            calcul(totalTaxOption, totalOption, effectiveTotalAcces); //on rappele la fonction de calcul general
                        });


                        //si on change values accessoires

                        $("#acces1, #acces2, #acces3, #acces4, #acces5").on('change', function (totalTaxOption, totalOption) {
                            var priceAcces1 = $("#acces1").val();
                            priceAcces1 = parseInt(priceAcces1);

                            var priceAcces2 = $("#acces2").val();
                            priceAcces2 = parseInt(priceAcces2);

                            var priceAcces3 = $("#acces3").val();
                            priceAcces3 = parseInt(priceAcces3);

                            var priceAcces4 = $("#acces4").val();
                            priceAcces4 = parseInt(priceAcces4);

                            var priceAcces5 = $("#acces5").val();
                            priceAcces5 = parseInt(priceAcces5);

                            var totalAcces = priceAcces1 + priceAcces2 + priceAcces3 + priceAcces4 + priceAcces5;
                            var effectiveTotalAcces = totalAcces - 850;
                            if (effectiveTotalAcces < 0 ){
                                effectiveTotalAcces = 0;
                            }

                            calcul(totalTaxOption, totalOption, effectiveTotalAcces);
                        });



                        //function de calcul general
                        function calcul() {

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
                            var totalTaxOption = ((totalPriceOption * 0.945) * (taxRate * 0.01)) / (1 - (taxRate * 0.01));
                            var totalOption = totalTaxOption + totalPriceOption;

                            var priceAcces1 = $("#acces1").val();
                            priceAcces1 = parseInt(priceAcces1);

                            var priceAcces2 = $("#acces2").val();
                            priceAcces2 = parseInt(priceAcces2);

                            var priceAcces3 = $("#acces3").val();
                            priceAcces3 = parseInt(priceAcces3);

                            var priceAcces4 = $("#acces4").val();
                            priceAcces4 = parseInt(priceAcces4);

                            var priceAcces5 = $("#acces5").val();
                            priceAcces5 = parseInt(priceAcces5);

                            var totalAcces = priceAcces1 + priceAcces2 + priceAcces3 + priceAcces4 + priceAcces5;
                            var effectiveTotalAcces = totalAcces - 850;
                            if (effectiveTotalAcces < 0 ){
                                effectiveTotalAcces = 0;
                            }

                            //calcul effective price vehicle
                            var effectivePrice = x.Vehicle_Price_including_VAT-3400;

                            //calcul taxe prix vehicule
                            var pricetax = ((effectivePrice * 0.945) - 250) * (taxRate * 0.01) / (1 - (taxRate * 0.01));

                            //calcul taxes totales
                            var totaltax = pricetax + totalTaxOption;

                            //calcul prix total vehicuke + taxes(vehicule + option)
                            var totalprice = effectivePrice + pricetax + totalOption + effectiveTotalAcces;

                            //calcule benefit
                            var effectiveTotalPrice = effectivePrice + effectiveTotalAcces;
                            var unlimitedBenefit=(effectiveTotalPrice*0.014)+255;
                            var limitedBenefit=(effectiveTotalPrice*0.014)+105;
                            //on affiche les resultas des calcul

                            $('#box2').html(
                                '<p>LIST PRICE : '+ x.Vehicle_Price_including_VAT +'</p>'+
                                '<p>CO2: '+ currentCO2+'</p>'+
                                '<p>TAXRATE: '+ taxRate +'</p>'+
                                '<p> TOTAL TAX: ' + totaltax + '</p>' +
                                '<p>TOTAL PRICE WITH TAX: ' + totalprice + '</p>'+
                                '<p>UNLIMITED BENEFIT : ' + unlimitedBenefit + '</p>'+
                                '<p>LIMITED BENEFIT : ' + limitedBenefit + '</p>');
                        }
                        calcul();           //on appele la function pour calculer au on change
                    });
                }
            })
        });
    }
});