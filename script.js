$(document).ready(function() {

    //petit script pour recuperer la liste des marque uniques, pour faciliter le code

    // $('#clickable').click(function(){

    // $.getJSON('vehicules.json', function(data){
    //     var results =[];
    //     var uniqresult=[];
    //     _.uniq(data,  function (x) {
    //         results.push(x.Vehicle_Make);
    //     });
    //
    //
    //     $.each(results, function(i, el){
    //         if($.inArray(el, uniqresult) === -1) uniqresult.push(el);
    //     });
    //
    //
    //     $('.box').append('<li>' + uniqresult + '</li>');
    //     });
    // });


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
            $.each(data,  function (index, x) {
                if(x.Vehicle_Make === vh_make){
                    $("#models").append('<option value="'+ x.Vehicle_Model +'">' + x.Vehicle_Description + '</option>');
                }
            })
        })
    }

    //on recupere données du modele pour calcul

    function calc(){
        var vh_model = $("#models").val();
        $("#box").html("");

        $.getJSON('vehicules.json', function(data) {
            $.each(data,  function (index, x) {
                if(x.Vehicle_Model === vh_model){

                    $("#box").append('<li>'+
                        '<p>PRIX : '+ x.Vehicle_Price_including_VAT +'€</p>'+
                        '<p>TYPE : ' + x.Vehicle_Kind + '</p>'+
                        '<p>CO2 : ' + x.Vehicle_CO2 + 'g/km</p>'+
                        '<p>FUEL_TYPE :'  + x.Fuel_Type + '</p>'+
                        '<p>MAX_WEIGHT : ' + x.Maximum_Weight + '</p>'+
                        '</li><hr>');
                }
            })
        })
    }



});

