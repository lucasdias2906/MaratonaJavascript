
module.exports = (sequelize, DataTypes) => {

    const Link = sequelize.define("Link", {
        label:{
             type:DataTypes.STRING,
             allowNull:false
        },
        url:{
             type:DataTypes.STRING,
             allowNull:false
        },
        image:{
            type:DataTypes.STRING,
            allowNull:false
       },
       isSocial:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        default:0
   }
    })

    // QUE A TABELA DE LINK  PERTECEM AO ACCOUNT E NA TABELA TEM UM CAMPO QUE CHAMA ACCOUNT ID
    Link.associate = (models)=>{
        Link.belongsTo(models.Account, {foreignKey:"accountId"})
    }
 
    return Link
 }