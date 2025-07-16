import 'dotenv/config'
import { app } from './app'
import { AppDataSource, TestDataSource } from './config/data.config'
import chalk from 'chalk'


const PORT = process.env.PORT

const startServer = async () => {



    try{

        await AppDataSource.initialize();
        console.log(chalk.yellowBright("DATA SOURCE INITIALIZED"));

        app.listen(PORT,()=>{
            console.log(chalk.blueBright(`THE SERVER IS RUNNING IN ${PORT}`))
        })

    }catch(err){
        console.log(chalk.red("ERROR OCCURED", err))
    }



    // try{

    //         await TestDataSource.initialize(); // API Test DB
    //         console.log(chalk.yellowBright("DATA SOURCE INITIALIZED"));

    //         app.listen(PORT,()=>{
    //             console.log(chalk.blueBright("THE SERVER IS RUNNING..."))
    //         })

    //     }catch(err){
    //         console.log(chalk.red("ERROR OCCURED", err))
    //     }


}

startServer()